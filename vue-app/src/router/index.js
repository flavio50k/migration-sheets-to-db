/* vue-app/src/router/index.js */
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import TaskList from '../views/TaskList.vue';
import TaskDetail from '../views/TaskDetail.vue';

const routes = [
  {
    path: '/login', /* Rota explícita para o Login */
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/', 
    redirect: '/tasks' /* Redireciona a raiz para as tarefas (fluxo normal do app) */
  }, 
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true } /* Protege a rota */
  },
  {
    path: '/tasks/:id', 
    name: 'TaskDetail',
    component: TaskDetail,
    props: true, 
    meta: { requiresAuth: true }
  },
  /* Opcional: catch-all */
  { path: '/:pathMatch(.*)*', redirect: '/' } 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* Guarda de navegação global para autenticação */
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token'); 
  const requiresAuth = to.meta.requiresAuth;

  /* 1. Acesso Negado: Rota protegida E não tem token */
  if (requiresAuth && !token) {
    if (to.name !== 'Login') {
      return next({ name: 'Login' }); /* Redireciona para o componente Login.vue */
    }
  /* 2. Já Autenticado: Tem token E tenta acessar a tela de Login */
  } else if (to.name === 'Login' && token) {
    return next({ name: 'TaskList' }); /* Redireciona para o App principal */
  }
  
  /* 3. Caso padrão: segue o fluxo normal */
  next();
});

export default router;