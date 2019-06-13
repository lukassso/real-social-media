let fbPromise

function loadFB() {
  if(fbPromise) return fbPromise;
  fbPromise = new Promise((resolve, reject) => {
    if (typeof window != 'undefined') {
      window.fbAsyncInit = function () {
        FB.init({
          appId: '309504659968408',
          cookie: true,
          xfbml: true,
          version: 'v3.3'
        });
        FB.AppEvents.logPageView()

        resolve(FB)
      }

      ;(function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        js = d.createElement(s)
        js.id = id
        js.src = "https://connect.facebook.net/en_US/sdk.js"
        fjs.parentNode.insertBefore(js, fjs)
      }(document, 'script', 'facebook-jssdk'))

    } else {
      reject('unavailable')
    }
  })
  return fbPromise
}



let fbModel

function getFBModel() {
  if(fbModel) return fbModel;

  fbModel = new Vue({
    data: {
      state: 'loading',
      loginStatus: null
    },
    methods: {
      init(FB) {
        this.state = 'ready'
        this.FB = FB
        FB.getLoginStatus(function(response) {
          this.loginStatus(response);
        })
      }
    }
  })

  loadFB().then(FB=> {
    fbModel.init(FB)
  }).catch(error => {
    if(error == 'unavailable') fbModel.state = 'unavailable'
      else fbModel.state = 'error'
  })

  return fbModel
}

export { fbModel, loadFB }
