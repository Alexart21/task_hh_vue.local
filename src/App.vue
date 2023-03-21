<template>
  <div class="container">
    <h1>Форма обратной связи</h1>
    <form @submit.prevent="sendForm" ref="form" action="">
      <div class="form-floating mb-3">
        <input
          name="name"
          type="text"
          class="form-control"
          id="inpName"
          placeholder="Ваше имя"
          v-model="name"
        />
        <label for="inpName">Ваше имя</label>
      </div>
      <div id="name-err" class="text-danger err-msgs"></div>
      <div class="form-floating mb-3">
        <input
          name="phone"
          v-phone
          placeholder="+7(___) ___-__-__"
          id="inpPhone"
          type="text"
          class="form-control"
        />
        <label for="inpPhone">Номер телефона</label>
      </div>
      <div id="phone-err" class="text-danger err-msgs"></div>
      <div class="form-floating">
        <textarea
          name="msg"
          class="form-control"
          placeholder="Ваше сообщение"
          id="inpMsg"
          style="height: 100px"
        ></textarea>
        <label for="floatingTextarea2">Ваше сообщение</label>
      </div>
      <div id="msg-err" class="text-danger err-msgs"></div>
      <br />
      <div class="form-group">
        <button class="btn btn-success">Отправить</button>
        &nbsp;&nbsp;<span v-if="loader" class="text-success">отправка...</span>
      </div>
    </form>
    <h3 class="text-success">{{ successText }}</h3>
    <h3 class="text-danger">{{ errText }}</h3>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  directives: {
    // маска ввода +7 (999) 999-99-99
    phone: {
      mounted(el) {
        el.oninput = function (e) {
          if (!e.isTrusted) {
            return;
          }
          const x = this.value
            .replace(/\D/g, "")
            .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
          x[1] = "+7";
          this.value = !x[3]
            ? x[1] + " (" + x[2]
            : x[1] +
              " (" +
              x[2] +
              ") " +
              x[3] +
              (x[4] ? "-" + x[4] : "") +
              (x[5] ? "-" + x[5] : "");
        };
      },
    },
  },
  data() {
    return {
      name: name,
      loader: false,
      successText: "",
      errText: "",
      csrf_token: "",
      errArr: [],
    };
  },
  methods: {
    clearMsgs() {
      this.successText = "";
      this.errText = "";
      let msgs = document.getElementsByClassName('err-msgs');
      let i = 0;
      while (msgs[i]) {
          msgs[i].innerHTML = '';
          i++;
      }
    },
    async sendForm() {
      this.clearMsgs();
      this.loader = true;
      let url = "/mail";
      let form = this.$refs.form;
      let formData = new FormData(form);
      formData.append("_token", this.csrf);
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      let result;
      if (!response.ok) {
        console.log(response);
        if (response.status == 422) {// ошибки валидации
          result = await response.json();
          let errors = result.errors;
          console.log(errors);
          for (let key in errors) {
            try {
              let errBlock = document.getElementById(key + "-err");
              errBlock.innerText = errors[key][0];
            } catch (e) {
              continue;
            }
          }
        } else {
          // другая ошибка
          this.errText = `Ошибка ${response.status} ${response.statusText}`;
        }
      } else {
        // статус 200
        result = await response.json();
        if (result.success) {
          // успешно
          console.log("form submitted");
          this.successText = `Спасибо, ${this.name} сообщение принято!`;
        }else {
          // console.log("фиг знает чё такое...");
          this.errText = 'Непредвиденная ошибка...';
          console.log(response);
        }
      }
      this.loader = false;
    },
  },
  computed: {
    ...mapGetters(["csrf"]),
  },
};
</script>
