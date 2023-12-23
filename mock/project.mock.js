import projectRaw from './project.json'

const delay = (delay = 1000) => new Promise((resolve) => setTimeout(() => resolve(), delay))

const mocks = [
  {
    url: '/api/projects',
    method: 'get',
    rawResponse: async (req, res) => {
      await delay()
      const result = {
        projects: Array.from({ length: 100 }).map((_, i) => ({
          projectId: i,
          lastUpdated: '2023-12-18'
        }))
      }
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify(result))
    }
  },
  {
    url: '/api/projects/:id',
    method: 'get',
    rawResponse: async (req, res) => {
      await delay()
      const id = req.url.split('/').slice(-1)?.[0]
      if (id == undefined) {
        res.statusCode = 400
        res.end('error')
      }
      const result = {
        project: {
          ...projectRaw?.project,
          projectId: +id
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify(result))
    }
  }
]

export default mocks
