import Vue from 'vue'
import VueI18n from 'vue-i18n'

const messages = {
  en: {
    errors: {
      already_exists: 'Already exists',
      network: 'It seems the server is offline. Try again later',
      bad_request: 'Seems the request is not properly formed.',
      unknown: 'Wow. Something went wrong :P',
      invalid_signature: 'Could not properly sign request',
      invalid_email: 'Invalid email',
      invalid_username: 'Invalid username',
      invalid_fullname: 'Full name missing',
      invalid_password: 'Invalid password',
      invalid_password_repeat: "Both passwords don't match",
      not_fount: 'This resource does not seem to exist',
      invalid_attributes: 'Invalid value'
    },
    fields: {
      team_name: 'Team name',
      username: 'Username',
      fullname: 'Full name',
      email: 'Email',
      password: 'Password',
      password_repeat: 'Your password again'
    },
    register: {
      welcome: 'Welcome to KeyCat. Please register',
      done: 'Congratulations! You have properly registered',
      send: 'Register',
      error: {
        username: 'Username invalid. Probably too short',
        email: 'Email invalid',
        duplicate: 'Alredy taken'
      }
    },
    confirm_email: {
      title: 'Confirm your email',
      token: 'Confirmation token',
      done: 'You have confirmed your email'
    },
    resend_email: {
      title: 'Resend confirmation email',
      done: 'Confirmation mail has been sent if the email exists'
    },
    login: {
      welcome: 'Please login',
      send: 'Login',
      error: {
        you_cannot_do_that: 'Either the username is invalid or the password is'
      }
    },
    send: 'Send',
    team: 'Team',
    logout: 'Log out',
    create_new_team: 'Create new team',
    configure: 'Configure',
    select_team: 'Change team',
    users: 'Users',
    vaults: 'Vaults',
    check_invite: 'Check invite',
    check_invite_contents: 'Please verify that the spelling is correct for'
  },
  ca: {
    message: {
      welcome: 'Benvingut'
    }
  }
}

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages // set locale messages
})
