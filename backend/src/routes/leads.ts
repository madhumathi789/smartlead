import { Router } from 'express'
import {
  getLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead
} from '../controllers/leadController'
import { protect, adminOnly } from '../middleware/auth'

const router = Router()

router.use(protect)

router.get('/', getLeads)
router.post('/', createLead)
router.get('/:id', getLead)
router.put('/:id', updateLead)
router.delete('/:id', adminOnly, deleteLead)

export default router