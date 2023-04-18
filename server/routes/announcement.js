const express = require("express");
const router = express.Router();
const multer = require("multer");
const Announcement = require("../models/AnnouncementModel");

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
  fileFilter: fileFilter,
});

// Route for creating a new announcement
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Create a new announcement with the image URL
    const announcement = new Announcement({
      title,
      content,
      author,
      image: req.file.path
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
