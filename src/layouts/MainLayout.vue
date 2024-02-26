<!-- 首頁畫面 -->
<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Quasar Practice
        </q-toolbar-title>
        <div>
          <q-btn flat round icon="language">
            <q-menu>
              <q-list>
                <q-item clickable @click="switchLanguage(language.value)" v-for="(language, index) in languages"
                  :key="index">
                  <q-item-section>{{ language.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div>Quasar v{{ $q.version }}</div>
        <div>
          <q-btn style="margin-left: 20px;" icon="person">
            <!-- ~~~~~~~~~~~~~~~~~~~~~~登入前的狀態~~~~~~~~~~~~~~~~~~~~~~~~~ -->
            <q-menu v-if="!login">
              <div class="row no-wrap q-pa-md" style="width: 113px;">
                <!-- <div class="column" style="width: 50%; margin-top: 20px;">
                  <p style="margin: auto; font-size: 18px;">未登入</p>
                </div>
                <q-separator vertical inset class="q-mx-lg" /> -->
                <div class="column">
                  <q-avatar size="80px">
                    <img src="https://cdn.pixabay.com/photo/2014/04/03/10/32/businessman-310819_1280.png">
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{}}</div>
                  <q-btn style=" font-size: 12px;" color="primary" label="登入" push size="sm" v-close-popup />
                </div>
              </div>
            </q-menu>
            <!-- ~~~~~~~~~~~~~~~~~~~~~~~~登入後狀態~~~~~~~~~~~~~~~~~~~~~~ -->
            <q-menu v-else>
              <div class="row no-wrap q-pa-md" style="width: 300px;">
                <div class="column" style="width: 50%; margin-top: 20px;">
                  <p>當前用戶</p>
                  <p>帳號: {{ user.USER_ID }}</p>
                  <p>用戶名: {{ apiname }}</p>
                </div>
                <q-separator vertical inset class="q-mx-lg" />
                <div class="column">
                  <q-avatar size="80px">
                    <img src="https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548_1280.jpg">
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{}}</div>
                  <q-btn style=" font-size: 12px;" color="primary" label="登出" push size="sm" v-close-popup
                    @click="logout" />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>


    <!-- 左邊功能表外框   show-if-above加入後會預設打開   -->
    <q-drawer style="background-color: rgb(203, 247, 203);" v-model="leftDrawerOpen" elevated overlay bordered>
      <q-list>
        <q-item-label header>
          {{ $t('menutitle') }}
        </q-item-label>
        <!-- 內容內縮程度 -->
        <!-- 新的 透過json實現父子關係列表 -->
        <div v-for="item in items" :key="item.MENU_ID">
          <q-expansion-item expand-seperator :label="item.MENU_ID" :content-inset-level="0.4"
            header-class="bg-teal text-white" expand-icon-class="text-white">
            <template v-for="child in item.children" :key="child.MENU_ID">
              <q-item clickable tag="router-link" :to="child.PATH">
                <q-item-section v-if="child.ICON" avatar>
                  <q-icon :name="child.ICON" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ child.MENU_ID }}</q-item-label>
                  <q-item-label caption>{{ child.MENU_NAME }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-expansion-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'


export default defineComponent({
  name: 'MainLayout',

  components: {

  },

  setup() {
    const leftDrawerOpen = ref(false)

    const login = ref(null)
    const user = ref(null)
    let apiname = ref('')
    const router = useRouter()
    let lang = ref('tw')
    const $q = useQuasar()
    const { $i18n } = useQuasar()


    let items = ref([])
    //新的 有父子關係

    onMounted(async () => {
      axios.post(process.env.env_API + '/VueTest/QueryMenuInfo', { "MENU_ID": "" })
        .then(response => {
          console.log(response.data)
          items.value = response.data
          console.log(items)
          console.log("get linkChildren data ok!!!")

        })
        .catch(error => {
          console.log(error)
        })
    })


    onMounted(() => {
      const getuser = sessionStorage.getItem('user')
      if (getuser) {
        login.value = true
        user.value = JSON.parse(getuser)
        axios.post(process.env.env_API + '/VueTest/QueryUser', { "USER_ID": user.value.USER_ID })
          .then(response => {
            console.log(response.data)
            apiname.value = response.data[0].USER_NAME
          })
          .catch(error => {
            console.log(error)
          })
      }
      else {
        login.value = false
      }
    })

    const logout = () => {
      sessionStorage.clear();
      router.push('UserSet')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
    // ---------------------------切換語言--------------------------------
    const switchLanguage = (selectedlan) => {
      lang.value = selectedlan
      console.log(lang.value)
      $i18n.locale = lang.value
    }



    return {
      switchLanguage,
      lang,
      languages: [
        { value: 'en-US', label: 'English' },
        { value: 'zh-TW', label: '繁體中文' }
      ],
      apiname,
      user,
      logout,
      login,
      items,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }

  }
})
</script>
