(function () {
	'use strict'

	function equalsSubset (actual, expected) {
		function traverse (actual, expected) {
			if (actual === expected) {
				return { matches: true }
			}

			if (typeof actual === 'object' && actual) {
				for (let key of Object.keys(expected)) {
					const { matches, path } = traverse(actual[key], expected[key])

					if (!matches) {
						return { matches: false, path: [key, ...path] }
					}
				}
			} else {
				return { matches: false, path: [] }
			}

			return { matches: true }
		}

		const { matches, path } = traverse(actual, expected)

		if (!matches) {
			return {
				matches,
				path: path.join('.')
			}
		} else {
			return { matches }
		}
	}

	function toEqualSubset (util, customEqualityTesters) {
		return {
			compare (actual, expected) {
				if (typeof actual !== 'object' || !actual) {
					return {
						pass: false,
						message: `Expected an object`
					}
				}

				const { matches, path } = equalsSubset(actual, expected)

				return matches ? {
					pass: true,
					message: `Expected the objects to not match`
				} : {
					pass: false,
					message: `Expected the values of the "${path}" property to match`
				}
			}
		}
	}

	window.c64Test = window.c64Test || {}
	window.c64Test.CustomMatchers = {
		toEqualSubset
	}
})()
