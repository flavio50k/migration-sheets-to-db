/* vue-app/src/views/TaskDetail.js */
import MigrationUpload from "../components/migration/MigrationUpload.vue";

export default {
  name: "TaskDetail",
  components: {
    MigrationUpload,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      default: 'user',
    },
  },
  computed: {
    taskId() {
      return this.id;
    },
  },
  methods: {
    handleMigrationComplete() {
      console.log(`Upload concluído para a Tarefa ID: ${this.taskId}`);
    }
  }
};