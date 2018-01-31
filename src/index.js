import {
  loadScript,
  validateRequired,
  isString,
  isFunction,
  validateRecaptchaId,
  buildParamError,
  render,
  createContainer
} from './utils'

/**
 * Create an invisible grecaptcha and returns the id of the capctha.
 * @param {Object} options - The options to create a invisible recaptcha.
 * @param {string} options.sitekey - Your recaptcha sitekey. You can get one here: https://www.google.com/recaptcha/admin.
 * @param {verifyCallback} options.callback - Captcha callback.
 * @param {string} [options.locale] - Language of the captcha. See available language codes https://developers.google.com/recaptcha/docs/language. Auto-detects the user's language if unspecified.
 * @param {string} [options.position = bottomright] - Position the reCAPTCHA badge. Values: bottomright, bottomleft and inline.
 * @param {HTMLElement} [options.container] - Container where the captcha will be renderedd. If none is provided a empty div will be create on the body.
 * @returns {number}
 */
export function createInvisibleGrecaptcha({
  sitekey,
  callback,
  locale = null,
  position = 'bottomright',
  container = createContainer()
}) {
  validateRequired(sitekey, 'sitekey')
  validateRequired(callback, 'callback')

  return new Promise((resolve, reject) => {
    if (!isString(sitekey)) {
      reject(buildParamError('sitekey', 'string'))
    }

    if (!isString(position)) {
      reject(buildParamError('position', 'string'))
    }

    if (locale !== false && !isString(locale)) {
      reject(buildParamError('locale', 'string'))
    }

    if (!isFunction(callback)) {
      reject(buildParamError('callback', 'function'))
    }

    if (window.grecaptcha) {
      resolve(render({container, sitekey, callback, position}))
    } else {
      loadScript(locale)
        .then(() => {
          resolve(render({container, sitekey, callback, position}))
        })
        .catch(reject)
    }
  })
}

/**
 * Programatically invoke the reCAPTCHA check.
 * @param {number} recaptchaId - Captcha id.
 */
export function execute(recaptchaId) {
  validateRecaptchaId(recaptchaId)
  window.grecaptcha.execute(recaptchaId)
}

/**
 * Resets the reCAPTCHA widget.
 * @param {number} recaptchaId - Captcha id.
 */
export function reset(recaptchaId) {
  validateRecaptchaId(recaptchaId)
  window.grecaptcha.reset(recaptchaId)
}

/**
 * Gets the response for the reCAPTCHA widget.
 * @param {number} recaptchaId - Captcha id.
 * @returns {string}
 */
export function getResponse(recaptchaId) {
  validateRecaptchaId(recaptchaId)
  return window.grecaptcha.getResponse(recaptchaId)
}

/**
 * Callback to be executed when the user submits a successful CAPTCHA response.
 * @callback verifyCallback
 * @param {string} token - Recaptcha token.
 */
