/**
 * @param {Function} fn
 * @return {Promise}
 * @api public
 */

 export function autoCompleteGenFunc(gen) {
    var ctx = this;
    var args = slice.call(arguments, 1);
  
    return new Promise(function(resolve, reject) {
      if (typeof gen === 'function') gen = gen.apply(ctx, args);
      if (!gen || typeof gen.next !== 'function') return resolve(gen);
  
      onFulfilled();
  
      /**
       * @param {Mixed} res
       * @return {Promise}
       * @api private
       */
  
      function onFulfilled(res) {
        var ret;
        try {
          ret = gen.next(res);
        } catch (e) {
          return reject(e);
        }
        next(ret);
        return null;
      }
  
      /**
       * @param {Error} err
       * @return {Promise}
       * @api private
       */
  
      function onRejected(err) {
        var ret;
        try {
          ret = gen.throw(err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
  
      /**
       * return a promise.
       *
       * @param {Object} ret
       * @return {Promise}
       * @api private
       */
  
      function next(ret) {
        if (ret.done) return resolve(ret.value);
        var value = toPromise.call(ctx, ret.value);
        if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
        return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "' + String(ret.value) + '"'));
      }
    });
  }