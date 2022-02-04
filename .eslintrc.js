module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        'plugin:vue/essential',
        'google',
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'plugins': [
        'vue',
    ],
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': 0,
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
    },
}
