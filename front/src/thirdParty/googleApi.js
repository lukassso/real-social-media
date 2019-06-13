let googPromise

function loadGoogle() {
  if(googPromise) return googPromise
  let resolved = false
  googPromise = new Promise((resolve, reject) => {
    if (typeof window != 'undefined') {
      window.googAsyncInit = function () {
        if(resolved) return
        resolved = true
        resolve(gapi)
      }

      ;(function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) return
        js = d.createElement(s)
        js.id = id
        js.src = "https://apis.google.com/js/platform.js?onload=googAsyncInit"
        fjs.parentNode.insertBefore(js, fjs)
      }(document, 'script', 'google-jssdk'))
    } else {
      reject('unavailable')
    }
  })
  return googPromise
}

let googAuth2Promise

async function loadGoogleAuth2() {
  if(googAuth2Promise) return googAuth2Promise
  let gapi = await loadGoogle()
  let resolved = false
  googAuth2Promise = new Promise((resolve, reject) => {
    gapi.load('auth2', async function() {
      if(resolved) return
      resolved = true
      let gauth = await gapi.auth2.init({
        client_id: "631648623348-q4v925bgid94b5mghjae24vim8tcv3eq.apps.googleusercontent.com"
      })
      resolve(gauth)
    })
  })
  return googAuth2Promise
}



export { loadGoogle, loadGoogleAuth2 }
