/* vue-app/src/views/TaskList.js */
import TaskLogic from "../mixins/TaskLogic.js";
import TaskItem from "../components/task/TaskItem.vue";

export default {
  name: "TaskList",
  /* Importa a lógica "pesada" (CRUD) do Mixin */
  mixins: [TaskLogic],
  /* Registra os componentes filhos */
  components: {
    TaskItem,
  },
  /* Recebe as props do Router/App.vue */
  props: {
    token: { type: String, required: true },
    userRole: { type: String, required: true },
  },
  methods: {
    /* Método específico da View (navegação) */
    handleSelectTask(taskId) {
      this.$router.push({ name: 'TaskDetail', params: { id: taskId } });
    }
  }
};