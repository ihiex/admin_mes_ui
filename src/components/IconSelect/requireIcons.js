
let req = require.context('../../icons/svg', false, /\.svg$/)
let requireAll = requireContext => requireContext.keys()

let re = /\.\/(.*)\.svg/

let icons = requireAll(req).map(i => {
  return i.match(re)[1]
})

export default icons

