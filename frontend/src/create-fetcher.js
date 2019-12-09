
export default function(f) {
  var cache = {}

  return {
    clearCache() {
      cache = {}
    },
    read(...args) {
      var key = args.join('|')

      if (key in cache) {
        return cache[key]
      } else {
        throw f(...args).then(val => {
          cache[key] = val
        })
      }
    }
  }
}

