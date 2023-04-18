const express = require("express");
const router = express.Router();
const multer = require("multer");
const DIR = './uploads/';
const Announcement = require("../models/AnnouncementModel");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});

// Route for creating a new announcement
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Create a new announcement with the image URL
    const announcement = new Announcement({
      ...req.body
    });

    // Save the announcement to the database
    const savedAnnouncement = await announcement.save();

    res.json(savedAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get all announcements
router.get("/", async (req, res) => {
    try {
        const announcements = await Announcement.find();

        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one announcement
router.get("/:id", getAnnouncement, (req, res) => {
    res.json(res.announcement);
});

// Update one announcement
router.put('/:id', (request, response) => {
    const announcementId = request.params.id;
    const updatedData = request.body;
  
    Announcement.findById(announcementId)
      .then((announcement) => {
        if (!announcement) {
          return response.status(404).send({ message: 'Announcement not found' });
        }
  
        announcement.set(updatedData);
        return announcement.save();
      })
      .then(() => {
        response.status(204).send();
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send({ message: 'Error updating announcement' });
      });
  });

// Delete one announcement

router.delete('/:id', (request, response) => {
    Announcement.deleteOne({_id : request.params.id})
      .then(() => {
        response.status(200).send({ message: "The announcement has been deleted" });
      })
      .catch(error => {
        response.status(400).send(error);
      })
  });
  

// Middleware function to get a single announcement by ID
async function getAnnouncement(req, res, next) {
    let announcement;

    try {
        announcement = await Announcement.findById(req.params.id);

        if (announcement == null) {
            return res
                .status(404)
                .json({ message: "Cannot find announcement" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.announcement = announcement;

    next();
}

module.exports = router
