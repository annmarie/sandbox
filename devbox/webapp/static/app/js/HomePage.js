// - HomePage Class - //
class HomePage {

  constructor($el) {
    const $authDisplay = $el.find('[data-target=auth-display]')
    const $isAuthDisplay = $authDisplay.find('[data-target=is-auth-display]')
    const $notAuthDisplay = $authDisplay.find('[data-target=not-auth-display]')

    fetch('/api/me', { method: 'get', credentials: 'include' })
    .then(r => r.json().then(data => {
      if (data.status) {
        $isAuthDisplay.toggleClass("hidden", false)
        $isAuthDisplay.find('[data-target=auth-user-email]').html(data.me.email)
        $notAuthDisplay.toggleClass("hidden", true)
      } else {
        $notAuthDisplay.toggleClass("hidden", false)
        $isAuthDisplay.toggleClass("hidden", true)
      }
    }))
  }
}

module.exports = ($el) => new HomePage($el)
