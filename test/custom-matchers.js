(function () {
	'use strict'

	function toEqualSubset (util, customEqualityTesters) {
		return {
			compare (actual, expected) {
				if (typeof actual !== 'object' || !actual) {
					return {
						pass: false,
						message: `Expected an object`
					}
				}

				let mismatchingKey
				const matching = Object.keys(expected).every((key) => {
					const equals = util.equals(actual[key], expected[key])

					if (!equals) {
						mismatchingKey = key
					}

					return equals
				})

				return matching ? {
					pass: true,
					message: `Expected the objects to not match`
				} : {
					pass: false,
					message: `Expected the values of the "${mismatchingKey}" property to match`
				}
			}
		}
	}

	window.c64Test = window.c64Test || {}
	window.c64Test.CustomMatchers = {
		toEqualSubset
	}
})()
