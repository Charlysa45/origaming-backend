const { palindrome } = require('../utils/for_testing')

test('palindrome of Matrexsito', () => {
    const result = palindrome('Matrexsito')

    expect(result).toBe('otisxertaM')
})

test('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})