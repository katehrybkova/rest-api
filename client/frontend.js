import Vue from "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js";

Vue.component("loader", {
  template: ` <div class="d-flex justify-content-center mt-3">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>`,
});

new Vue({
  el: "#app",
  data() {
    return {
      form: {
        name: "",
        value: "",
      },
      contacts: [],
      loading: false,
    };
  },
  computed: {
    canCreate() {
      return this.form.value.trim() && this.form.name.trim();
    },
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form;
      const newContact = await request("api/contacts", "POST", contact);

      this.contacts.push(newContact);
      this.form.name = this.form.value = "";
    },
    async markContact(id) {
      const contact = this.contacts.find((c) => c.id === id);
      const updated = await request(`/api/contacts/${id}`, "PUT", {
        ...contact,
        marked: true,
      });

      contact.marked = updated.marked;
    },
    async removeContact(id) {
      await request(`/api/contacts/${id}`, "DELETE");
      this.contacts = this.contacts.filter((c) => c.id !== id);
    },
  },
  async mounted() {
    this.loading = true;
    const data = await request("/api/contacts");
    this.contacts = data;
    this.loading = false;
  },
});
async function request(url, method = "GET", data = null) {
  try {
    const headers = {};
    let body;

    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const responce = await fetch(url, { method, headers, body });
    return await responce.json();
  } catch (e) {
    console.warn("message: error", e.message);
  }
}
