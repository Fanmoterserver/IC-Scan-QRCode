/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import MasterDataController from '#controllers/master_data_controller'
import ScanController from '#controllers/scan_controller'
import DataSummaryController from '#controllers/data_summary_controller'


router.get('/master-data', [MasterDataController, 'index'])
router.post('/master-data', [MasterDataController, 'store'])
router.delete('/master-data/:id', [MasterDataController, 'destroy'])

router.get('/scan-qrcode', [ScanController, 'index'])
router.post('/scan-qrcode', [ScanController, 'store'])
router.delete('/scan-qrcode/:id', [ScanController, 'destroy'])

router.get('/', [DataSummaryController, 'index'])
router.get('/data-summary/details', [DataSummaryController, 'details'])