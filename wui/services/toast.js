import toast from 'izitoast'
import i18n from '../i18n'

const toastSvc = {
  error: (key, title = 'Error') => {
    var msg = i18n.te(key) ? i18n.t(key) : key
    return toast.error({
      title: title,
      message: msg,
      position: 'bottomRight'
    })
  },
  success: (key, title = 'Success') => {
    var msg = i18n.te(key) ? i18n.t(key) : key
    return toast.success({
      title: title,
      message: msg,
      position: 'bottomRight'
    })
  }
}

export default toastSvc
