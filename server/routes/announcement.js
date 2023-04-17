const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const Announcement = require("../models/AnnouncementModel");

// Configure Cloudinary API credentials
cloudinary.config({
  cloud_name: 'dpkopzc8h',
  api_key: '618761729683793',
  api_secret: 'UJq_ixkyIGMRfPodgS588Vb6DXU'
});

// Route for creating a new announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, author, image } = req.body;

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path);

    // Create a new announcement with the image URL
    const announcement = new Announcement({
      title,
      content,
      author,
      image: result.secure_url
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

module.exports = router;
