import inquirer from 'inquirer'
import axios from 'axios'

const BASE_URL = 'https://calculadora-fxpc.onrender.com'

async function listOperations() {
  try {
    const response = await axios.get(`${BASE_URL}/operations`)
    return response.data.operations
  } catch (error) {
    console.error('Erro ao listar operações:', error.message)
    return []
  }
}

async function calculate(path, a, b) {
  try {
    const fullPath = path.replace('param1', a).replace('param2', b)
    const response = await axios.post(`${BASE_URL}${fullPath}`, { a, b })
    return response.data.result
  } catch (error) {
    console.error(`Erro ao calcular operação:`, error.response?.data || error.message)
    return null
  }
}

async function main() {
  const operations = await listOperations()

  if (!operations.length) {
    console.log('Nenhuma operação disponível.')
    return
  }

  const { operation } = await inquirer.prompt({
    type: 'list',
    name: 'operation',
    message: 'Escolha a operação:',
    choices: operations.map(op => ({ name: op.name, value: op.path })),
  })

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'a',
      message: 'Digite o primeiro número:',
      validate: value => !isNaN(parseFloat(value)) || 'Por favor, digite um número válido',
      filter: Number,
    },
    {
      type: 'input',
      name: 'b',
      message: 'Digite o segundo número:',
      validate: value => !isNaN(parseFloat(value)) || 'Por favor, digite um número válido',
      filter: Number,
    },
  ])

  const result = await calculate(operation, answers.a, answers.b)

  if (result !== null) {
    console.log(`\nResultado: ${result}\n`)
  }
}

main()