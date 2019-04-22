const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});
const faker = require('faker');

const User = conn.define('user', {
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  middleName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
  },
});

const syncAndSeed = () => {
  return conn.sync({ force: true }).then(() => {
    let count = 0;
    while (count < 8278) {
      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        middleName: faker.name.firstName(),
        email: faker.internet.email(),
        title: faker.name.title(),
      });
      count++;
    }
  });
};

const express = require('express');
const app = express();
const path = require('path');
const volleyball = require('volleyball');

app.use(volleyball);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/users/', (req, res, next) => {
  const countAndUsers = {};
  User.count()
    .then(records => {
      countAndUsers.count = records;
    })
    .then(() => {
      User.findAll({
        limit: 50,
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
      })
        .then(users => {
          countAndUsers.users = users;
        })
        .then(() => {
          res.send(countAndUsers);
        })
        .catch(next);
    })
    .catch(next);
});

app.get('/api/users/:index', (req, res, next) => {
  const countAndUsers = {};
  User.count()
    .then(records => {
      countAndUsers.count = records;
    })
    .then(() => {
      User.findAll({
        offset: 50 * (req.params.index * 1),
        limit: 50,
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
      })
        .then(users => {
          countAndUsers.users = users;
        })
        .then(() => {
          res.send(countAndUsers);
        })
        .catch(next);
    })
    .catch(next);
});

app.get('/api/users/search/:searchTerm', (req, res, next) => {
  const countAndUsers = {};
  User.count({
    where: {
      [Sequelize.Op.or]: [
        {
          firstName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
        {
          lastName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
        {
          middleName: {
            [Sequelize.Op.iLike]: `%${req.params.searchTerm}%`,
          },
        },
        {
          email: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
        {
          title: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
      ],
    },
  })
    .then(records => {
      countAndUsers.count = records;
    })
    .then(() => {
      User.findAll({
        where: {
          [Sequelize.Op.or]: [
            {
              firstName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
            {
              lastName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
            {
              middleName: {
                [Sequelize.Op.iLike]: `%${req.params.searchTerm}%`,
              },
            },
            {
              email: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
            {
              title: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
          ],
        },
        limit: 50,
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
      })
        .then(users => {
          countAndUsers.users = users;
        })
        .then(() => {
          res.send(countAndUsers);
        })
        .catch(next);
    })
    .catch(next);
});

app.get('/api/users/search/:searchTerm/:index', (req, res, next) => {
  const countAndUsers = {};
  User.count({
    where: {
      [Sequelize.Op.or]: [
        {
          firstName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
        {
          lastName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
        {
          middleName: {
            [Sequelize.Op.iLike]: `%${req.params.searchTerm}%`,
          },
        },
        {
          email: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
        {
          title: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
        },
      ],
    },
  })
    .then(records => {
      countAndUsers.count = records;
    })
    .then(() => {
      User.findAll({
        where: {
          [Sequelize.Op.or]: [
            {
              firstName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
            {
              lastName: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
            {
              middleName: {
                [Sequelize.Op.iLike]: `%${req.params.searchTerm}%`,
              },
            },
            {
              email: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
            {
              title: { [Sequelize.Op.iLike]: `%${req.params.searchTerm}%` },
            },
          ],
        },
        offset: 50 * (req.params.index * 1),
        limit: 50,
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
      })
        .then(users => {
          countAndUsers.users = users;
        })
        .then(() => {
          res.send(countAndUsers);
        })
        .catch(next);
    })
    .catch(next);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal Server Error');
});

const port = process.env.PORT || 3000;

syncAndSeed().then(() => {
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
});
