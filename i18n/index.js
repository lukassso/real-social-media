let i18n = () => {
  return i18n.languages[i18n.config.language];
}

if(typeof window != 'undefined') window.i18n = i18n

i18n.config = {
  language: 'en',
  locale: 'en'
}

i18n.languages = {
  en: require('./en')
}

module.exports = i18n