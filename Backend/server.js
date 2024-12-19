// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'VishweshK',
  database: 'needy_service'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

/* app.post('/api/addservice', (req, res) => {
  const { serviceName } = req.body;
  const query = 'INSERT INTO services (service_name) VALUES (?)';
  db.query(query, [serviceName], (err, result) => {
    if (err) {
      console.error('Error inserting service:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(result);
  });
}); */
app.post('/api/addservice', (req, res) => {
  const { serviceName } = req.body;
  console.log('Received serviceName:', serviceName);
  const checkQuery = 'SELECT * FROM services WHERE service_name = ?';
  const insertQuery = 'INSERT INTO services (service_name) VALUES (?)';

  if (!serviceName) {
    res.status(400).send('Service name cannot be empty');
    return;
  }

  db.query(checkQuery, [serviceName], (err, results) => {
    if (err) {
      console.error('Error checking service:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length > 0) {
      res.status(409).send('Service already exists'); // 409 Conflict
    } else {
      db.query(insertQuery, [serviceName], (err, result) => {
        if (err) {
          console.error('Error inserting service:', err);
          res.status(500).send('Server error');
          return;
        }
        res.send(result);
      });
    }
  });
});

app.get('/api/services', (req, res) => {
  const query = 'SELECT * FROM services';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.put('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const { serviceName } = req.body;
  console.log('Received serviceName:', serviceName);
  const query = 'UPDATE services SET service_name = ? WHERE service_id = ?';

  if (!serviceName) {
    res.status(400).send('Service name cannot be empty');
    return;
  }

  db.query(query, [serviceName, id], (err, result) => {
    if (err) {
      console.error('Error updating service:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(result);
  });
});

app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM services WHERE service_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting service:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send(result);
  });
});
// Endpoint to add a location
app.post('/api/addlocation', (req, res) => {
  const { location } = req.body;
  const checkQuery = 'SELECT * FROM location WHERE location = ?';
  const insertQuery = 'INSERT INTO location (location) VALUES (?)';

  db.query(checkQuery, [location], (err, results) => {
    if (err) {
      console.error('Error checking location:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length > 0) {
      res.status(409).send('Location already exists'); // 409 Conflict
    } else {
      db.query(insertQuery, [location], (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    }
  });
});

// Endpoint to fetch locations
app.get('/api/locations', (req, res) => {
  const query = 'SELECT * FROM location';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Endpoint to update a location
app.put('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  const query = 'UPDATE location SET location = ? WHERE loc_id = ?';
  db.query(query, [location, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Endpoint to delete a location
app.delete('/api/locations/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM location WHERE loc_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//provider

// Login endpoint
app.post('/api/provider/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM service_provider_registration WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const provider = results[0];

    // Check if the account is active
    if (provider.is_active !== 1) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Compare the provided password with the stored password
    if (password !== provider.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ message: 'Login successful', provider });
  });
});

app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT COUNT(*) AS count FROM service_provider_registration WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      res.status(500).send('Server error');
    } else {
      res.send({ exists: results[0].count > 0 });
    }
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Provider Registration Endpoint
app.post('/api/provider-registration', upload.single('service_certificate'), (req, res) => {
  const { name, mobile_number, service_id, service_name, loc_id, location, username, password, salary } = req.body;
  const service_certificate = req.file ? req.file.path : null;
  const is_active = 0; // Default value

  const query = `INSERT INTO service_provider_registration 
    (name, mobile_number, service_id, service_name, loc_id, location, service_certificate, username, password, salary, is_active) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [name, mobile_number, service_id, service_name, loc_id, location, service_certificate, username, password, salary, is_active], (err, results) => {
    if (err) {
      console.error('Error registering provider:', err);
      res.status(500).send('Server error');
    } else {
      res.send('Registration successful');
    }
  });
});


// Endpoint to get inactive providers
app.get('/api/providers/inactive', (req, res) => {
  const query = 'SELECT provider_id, name, mobile_number, service_name, location, username, salary, service_certificate FROM service_provider_registration WHERE is_active = 0';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    const providersWithFullPath = results.map(provider => {
      return {
        ...provider,
        service_certificate_url: provider.service_certificate ? `http://localhost:5000/${provider.service_certificate}` : null
      };
    });

    res.status(200).json(providersWithFullPath);
  });
});

// Endpoint to activate a provider
app.put('/api/providers/activate/:id', (req, res) => {
  const providerId = req.params.id;
  const query = 'UPDATE service_provider_registration SET is_active = 1 WHERE provider_id = ?';

  db.query(query, [providerId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.status(200).json({ message: 'Provider activated successfully' });
  });
});

//user
app.post('/api/user/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM user_registration WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user: results[0] });
  });
});

app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM user_registration WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    res.status(200).json({ exists: results.length > 0 });
  });
});

app.post('/api/user/register', (req, res) => {
  const { name, mobileNumber, address, username, password } = req.body;
  const checkQuery = 'SELECT * FROM user_registration WHERE username = ?';
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }
  const query = 'INSERT INTO user_registration (name, address, mobile_number, username, password) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, address, mobileNumber, username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    res.status(201).json({ message: 'User registered successfully' });
  });
});
});


//user side providers
app.get('/api/providers', (req, res) => {
  const { service, location } = req.query;

 /*  const query = `
    SELECT * FROM service_provider_registration 
    WHERE service_name = ? AND location = ? AND is_active = 1
  `; */
/*   const query = `
    SELECT sp.*, AVG(f.score) as avg_score
    FROM service_provider_registration sp
    LEFT JOIN feedback f ON sp.provider_id = f.provider_id
    WHERE sp.service_name = ? AND sp.location = ? AND sp.is_active = 1
    GROUP BY sp.provider_id
  `; */
  const query = `
    SELECT p.provider_id, p.name as provider_name, p.username as provider_username, p.mobile_number as provider_mobile, 
           p.service_id, s.service_name, p.loc_id, l.location, 
           AVG(f.score) as avg_score
    FROM service_provider_registration p
    JOIN services s ON p.service_id = s.service_id
    JOIN location l ON p.loc_id = l.loc_id
    LEFT JOIN feedback f ON p.provider_id = f.provider_id
    WHERE s.service_name = ? AND l.location = ? AND p.is_active = 1
    GROUP BY p.provider_id
  `;
  db.query(query, [service, location], (err, providers) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
   /*  if (providers.length === 0) {
      return res.status(200).json([]);
    } */
    // Fetch feedbacks for each provider
    const providerIds = providers.map(provider => provider.provider_id);
    if (providerIds.length === 0) {
      return res.status(200).json(providers);
    }
   /*  const feedbackQuery = `SELECT * FROM feedback WHERE provider_id IN (?)`; */
   const feedbackQuery = `
   SELECT f.provider_id, f.description
   FROM feedback f
   WHERE f.provider_id IN (?)
 `;
    db.query(feedbackQuery, [providerIds], (err, feedbacks) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'An error occurred', error: err });
      }
      const providerMap = providers.reduce((acc, provider) => {
        acc[provider.provider_id] = { ...provider, feedbacks: [] };
        return acc;
      }, {});

      feedbacks.forEach(feedback => {
        providerMap[feedback.provider_id].feedbacks.push(feedback);
      });

      const result = Object.values(providerMap);
      res.status(200).json(result);
    });
  });
});

     /*  // Attach feedbacks to providers
      const providersWithFeedbacks = providers.map(provider => {
        provider.feedbacks = feedbacks.filter(feedback => feedback.provider_id === provider.provider_id);
        return provider;
      });

      res.status(200).json(providersWithFeedbacks);
    });
  });
}); */
    /* res.status(200).json(results);
  });
});
 */
//booking service
app.post('/api/book-service', (req, res) => {
  const {
    provider_id,
    provider_name,
    provider_username,
    provider_mobile,
    service_id,
    service_name,
    loc_id,
    location,
    user_id,
    user_name,
    user_username,
    user_mobile,
    user_address
  } = req.body;

  const query = `
    INSERT INTO order_detail (
      provider_id, provider_name, provider_username, provider_mobile, 
      service_id, service_name, loc_id, location, 
      user_id, user_name, user_username, user_mobile,user_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;
  const values = [
    provider_id, provider_name, provider_username, provider_mobile,
    service_id, service_name, loc_id, location,
    user_id, user_name, user_username, user_mobile,user_address
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
    res.status(201).json({ message: 'Booking successful' });
  });
});
// Fetch orders for a provider
app.get('/api/orders/provider/:providerId', (req, res) => {
  const { providerId } = req.params;
  const query = `
    SELECT o.order_id, o.user_name, o.user_username, o.user_mobile, o.user_address, o.is_active
    FROM order_detail o
    WHERE o.provider_id = ?`;
  db.query(query, [providerId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
    res.status(200).json(results);
  });
});

// Update order to accept booking
app.put('/api/orders/accept/:orderId', (req, res) => {
  const { orderId } = req.params;
  const query = 'UPDATE order_detail SET is_active = 0 WHERE order_id = ?';
  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
    res.status(200).json({ message: 'Booking accepted' });
  });
});
//user view booking status
app.get('/api/user/bookings/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const query = 'SELECT * FROM order_detail WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }

    res.status(200).json(results);
  });
});

// Fetch providers that served the user
app.get('/api/user/providers/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const query = `SELECT DISTINCT sp.provider_id, sp.name, sp.username, sp.service_name, sp.location
                 FROM order_detail od
                 JOIN service_provider_registration sp ON od.provider_id = sp.provider_id
                 WHERE od.user_id = ?`;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
    res.status(200).json(results);
  });
});

// Submit feedback
app.post('/api/user/feedback', (req, res) => {
  const { provider_id, provider_name, provider_username, user_id, user_name, user_username, score, description } = req.body;

  const query = `INSERT INTO feedback (provider_id, provider_name, provider_username, user_id, user_name, user_username, score, description, created_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
  db.query(query, [provider_id, provider_name, provider_username, user_id, user_name, user_username, score, description], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred', error: err });
    }
    res.status(201).json({ message: 'Feedback submitted successfully' });
  });
});



app.listen(5000, () => {
  console.log('Server started on port 5000');
});