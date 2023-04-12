const express = require("express");
const router = express.Router();
const Announcement = require("../models/AnnouncementModel");

// Create a new announcement
router.post("/", async (req, res) => {
    try {
        const announcement = new Announcement({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        });

        await announcement.save();

        res.status(201).json(announcement);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
router.patch("/:id", getAnnouncement, async (req, res) => {
    if (req.body.title != null) {
        res.announcement.title = req.body.title;
    }

    if (req.body.content != null) {
        res.announcement.content = req.body.content;
    }

    if (req.body.author != null) {
        res.announcement.author = req.body.author;
    }

    try {
        const updatedAnnouncement = await res.announcement.save();

        res.json(updatedAnnouncement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one announcement
router.delete("/:id", getAnnouncement, async (req, res) => {
    try {
        await res.announcement.remove();

        res.json({ message: "Announcement deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
