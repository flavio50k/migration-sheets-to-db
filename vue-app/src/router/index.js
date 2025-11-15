/* vue-app/src/router/index.js */
import { createRouter, createWebHistory } from 'vue-router';
import TaskList from '../views/TaskList.vue';
import TaskDetail from '../views/TaskDetail.vue'; 

const routes = [
  /* Redireciona a raiz para a lista de tarefas, que será protegida pelo guarda
  { path: '/', redirect: '/tasks' }, */
  {
    path: '/',
    name: 'TaskList', // A rota raiz agora é a TaskList
    component: TaskList,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    // Redireciona /tasks para / se TaskList for a Home
    redirect: '/', 
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/:id', 
    name: 'TaskDetail',
    component: TaskDetail,
    props: true, 
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
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