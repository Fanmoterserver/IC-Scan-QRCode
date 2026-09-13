import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const MasterDataController = () => import('#controllers/master_data_controller')
const ScanController = () => import('#controllers/scan_controller')
const DataSummaryController = () => import('#controllers/data_summary_controller')

router.get('/login', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

router
  .group(() => {
    // Accessible by BOTH admin and user (admin passes this automatically)
    router.get('/', [DataSummaryController, 'index'])
    router.get('/data-summary', [DataSummaryController, 'index'])
    router.get('/data-summary/details', [DataSummaryController, 'details'])
    router.get('/scan-qrcode', [ScanController, 'index'])
    router.post('/scan-qrcode', [ScanController, 'store'])
  })
  .use([middleware.auth(), middleware.role(['admin', 'user'])])

router
  .group(() => {
    // Admin-ONLY — a 'user' role gets rejected here
    router.get('/master-data', [MasterDataController, 'index'])
    router.post('/master-data', [MasterDataController, 'store'])
    router.delete('/master-data/:id', [MasterDataController, 'destroy'])
    router.delete('/scan-qrcode/:id', [ScanController, 'destroy'])
  })
  .use([middleware.auth(), middleware.role(['admin'])])
