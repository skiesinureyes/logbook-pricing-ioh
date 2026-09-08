// __tests__/auditLogger.test.js

jest.mock('../src/models/AuditLog')

const AuditLog = require('../src/models/AuditLog')
const { logAudit } = require('../src/utils/auditLogger')

describe('logAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('mencatat aktivitas CREATE dengan parameter lengkap', async () => {
    AuditLog.create.mockResolvedValue({ id: 1 })

    await logAudit({
      action: 'CREATE',
      entityId: 10,
      bcCode: 'BC-001',
      bcTitle: 'Proyek A',
      userId: 5,
      description: 'Membuat BC baru'
    })

    expect(AuditLog.create).toHaveBeenCalledTimes(1)
    expect(AuditLog.create).toHaveBeenCalledWith(
      {
        action: 'CREATE',
        entityId: 10,
        bcCode: 'BC-001',
        bcTitle: 'Proyek A',
        userId: 5,
        description: 'Membuat BC baru'
      },
      {}
    )
  })

  test('mengganti bcCode dan bcTitle yang falsy menjadi null', async () => {
    AuditLog.create.mockResolvedValue({ id: 2 })

    await logAudit({
      action: 'DELETE',
      entityId: 20,
      bcCode: null,
      bcTitle: undefined,
      userId: 3
    })

    expect(AuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        bcCode: null,
        bcTitle: null,
        description: null
      }),
      {}
    )
  })

  test('menyertakan objek transaction ketika parameter transaction diberikan', async () => {
    AuditLog.create.mockResolvedValue({ id: 3 })
    const mockTransaction = { id: 'tx-123' }

    await logAudit({
      action: 'UPDATE',
      entityId: 30,
      bcCode: 'BC-002',
      bcTitle: 'Proyek B',
      userId: 7,
      description: 'Mengubah data',
      transaction: mockTransaction
    })

    expect(AuditLog.create).toHaveBeenCalledWith(
      expect.any(Object),
      { transaction: mockTransaction }
    )
  })

  test('tidak melempar error ketika AuditLog.create gagal (fail-safe)', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    AuditLog.create.mockRejectedValue(new Error('Koneksi database gagal'))

    await expect(
      logAudit({
        action: 'CREATE',
        entityId: 40,
        bcCode: 'BC-003',
        bcTitle: 'Proyek C',
        userId: 1
      })
    ).resolves.not.toThrow()

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AuditLog] Gagal mencatat audit log:',
      'Koneksi database gagal'
    )

    consoleErrorSpy.mockRestore()
  })
})