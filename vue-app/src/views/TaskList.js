/* vue-app/src/views/TaskList.js */
import TaskLogic from "../mixins/TaskLogic.js";
import TaskItem from "../components/task/TaskItem.vue";

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

export default {
  name: "TaskList",
  mixins: [TaskLogic],
  components: {
    TaskItem,
    'pv-input': InputText,
    'pv-button': Button,
    'pv-dropdown': Dropdown
  },
  props: {
    token: { type: String, required: true },
    userRole: { type: String, required: true },
  },
  data() {
      return {
          statusOptions: [
              { label: 'Todas as Tarefas', value: 'all' },
              { label: 'Em Aberto', value: 'open' },
              { label: 'Concluídas', value: 'completed' }
          ]
      }
  },
  methods: {
    handleSelectTask(taskId) {
      this.$router.push({ name: 'TaskDetail', params: { id: taskId } });
    }
  }
};