/* vue-app/src/components/task/TaskItem.js */

// 1. Importar os componentes do PrimeVue AQUI dentro do JS
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

export default {
  name: "TaskItem",
  // 2. Registrar os componentes AQUI
  components: {
      'pv-card': Card,
      'pv-button': Button,
      'pv-tag': Tag
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      editableTitle: this.task.title,
    };
  },
  watch: {
    "task.title"(newTitle) {
      this.editableTitle = newTitle;
    },
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      /* Precisamos usar setTimeout ou nextTick para garantir que o input renderizou */
      this.$nextTick(() => {
        // Tenta achar o input do PrimeVue ou o nativo
        const input = this.$el.querySelector('input[type="text"]');
        if(input) input.focus();
      });
    },
    saveEdit() {
      if (this.editableTitle.trim() && this.editableTitle !== this.task.title) {
        this.$emit("update-task", this.task.id, { title: this.editableTitle });
      }
      this.isEditing = false;
    },
  },
};