const routes = [
  {path: '/', component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: 'System/UserSet', component: () => import('pages/userLogin.vue') },
    { path: 'System/MenuSet', component: () => import('pages/userProduction.vue') },
    { path: 'Practice1/Practice1-1', component: () => import('pages/account_ex1.vue') },
    { path: 'Practice1/Practice1-2', component: () => import('pages/product_ex2.vue') },
    { path: 'Practice1/Practice1-3', component: () => import('pages/table_ex3.vue') },
    { path: 'Practice1/Practice1-4', component: () => import('pages/accountLoading_ex4.vue') },
    { path: 'actshowing_ex4', component: () => import('pages/actshowing_ex4.vue') },
  ]},

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes