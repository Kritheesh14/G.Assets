import express from 'express';
import auth from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  createAsset,
  listAssets,
  myAssets,
  dashboardStats,
  homeSummary,
  deleteAsset,
} from '../controllers/assetController.js';

const router = express.Router();

// public search/list
router.get('/', listAssets);

// create asset with uploaded file (field name: "assetFile")
router.post('/', auth, upload.single('assetFile'), createAsset);

// "My assets" for current user
router.get('/mine', auth, myAssets);

// delete one asset by id (must be owner)
router.delete('/:id', auth, deleteAsset);

// dashboard stats
router.get('/dashboard', auth, dashboardStats);

// home hero
router.get('/home-summary', homeSummary);

export default router;
