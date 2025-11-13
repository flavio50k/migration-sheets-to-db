/* vue-app/src/router/index.js (NOVO ARQUIVO) */
import { createRouter, createWebHistory } from 'vue-router';
/* As views serão criadas nos próximos passos */
import TaskList from '../views/TaskList.vue';
import TaskDetail from '../views/TaskDetail.vue'; 

const routes = [
  /* Redireciona a raiz para a lista de tarefas, que será protegida pelo guarda */
  { path: '/', redirect: '/tasks' }, 
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true } /* Protege a rota */
  },
  {
    /* Rota dinâmica para o detalhe da tarefa */
    path: '/tasks/:id', 
    name: 'TaskDetail',
    component: TaskDetail,
    props: true, /* Permite passar o :id como prop para TaskDetail.vue */
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(), /* Modo histórico (requer a config no nginx.conf, que você já tem) */
  routes,
});

/* Guarda de navegação global para autenticação */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  /* Se a rota requer autenticação E o token não existe... */
  if (to.meta.requiresAuth && !token && to.path !== '/') {
    /* Redireciona para o caminho raiz (onde App.vue mostrará a tela de Login) */
    next('/'); 
  } else {
    /* Permite a navegação */
    next();
  }
});

export default router;