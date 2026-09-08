/**
 * Unit Testing - IsiLogbook Business Case Helper Functions
 * Metode: White Box Testing
 * Framework: Jest
 * 
 * Fungsi yang diuji:
 * 1. sanitizeDate()
 * 2. sanitizeInt()
 * 3. sanitizeBigInt()
 * 4. sanitizeFloat()
 * 5. sanitizeStr()
 * 6. calculateAutoFields()
 * 7. generateChangeSummary()
 * 8. summarizeServiceDetails()
 */

const {
  sanitizeDate,
  sanitizeInt,
  sanitizeBigInt,
  sanitizeFloat,
  sanitizeStr,
  calculateAutoFields,
  generateChangeSummary,
  summarizeServiceDetails
} = require('../src/utils/bcHelpers')

// ─────────────────────────────────────────────────────────────────────────────
// 1. sanitizeDate
// ─────────────────────────────────────────────────────────────────────────────
describe('sanitizeDate()', () => {
  test('UT-01: mengembalikan null jika nilai null', () => {
    expect(sanitizeDate(null)).toBeNull()
  })

  test('UT-02: mengembalikan null jika nilai string kosong', () => {
    expect(sanitizeDate('')).toBeNull()
  })

  test('UT-03: mengembalikan null jika nilai "Invalid date"', () => {
    expect(sanitizeDate('Invalid date')).toBeNull()
  })

  test('UT-04: mengembalikan nilai tanggal valid apa adanya', () => {
    expect(sanitizeDate('2026-05-15')).toBe('2026-05-15')
  })

  test('UT-05: mengembalikan nilai undefined sebagai null', () => {
    expect(sanitizeDate(undefined)).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. sanitizeInt
// ─────────────────────────────────────────────────────────────────────────────
describe('sanitizeInt()', () => {
  test('UT-06: mengembalikan null jika nilai null', () => {
    expect(sanitizeInt(null)).toBeNull()
  })

  test('UT-07: mengembalikan null jika nilai undefined', () => {
    expect(sanitizeInt(undefined)).toBeNull()
  })

  test('UT-08: mengembalikan null jika nilai string kosong', () => {
    expect(sanitizeInt('')).toBeNull()
  })

  test('UT-09: mengembalikan integer dari nilai string angka', () => {
    expect(sanitizeInt('42')).toBe(42)
  })

  test('UT-10: mengembalikan integer dari nilai angka murni', () => {
    expect(sanitizeInt(2024)).toBe(2024)
  })

  test('UT-11: mengembalikan null jika nilai bukan angka (NaN)', () => {
    expect(sanitizeInt('abc')).toBeNull()
  })

  test('UT-12: mengembalikan 0 jika nilai adalah 0', () => {
    expect(sanitizeInt(0)).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. sanitizeBigInt
// ─────────────────────────────────────────────────────────────────────────────
describe('sanitizeBigInt()', () => {
  test('UT-13: mengembalikan null jika nilai null', () => {
    expect(sanitizeBigInt(null)).toBeNull()
  })

  test('UT-14: mengembalikan null jika nilai undefined', () => {
    expect(sanitizeBigInt(undefined)).toBeNull()
  })

  test('UT-15: mengembalikan null jika nilai string kosong', () => {
    expect(sanitizeBigInt('')).toBeNull()
  })

  test('UT-16: mengembalikan angka dari nilai IDR terformat (dengan titik)', () => {
    expect(sanitizeBigInt('1.000.000')).toBe(1000000)
  })

  test('UT-17: mengembalikan angka dari nilai numerik murni', () => {
    expect(sanitizeBigInt(5000000000)).toBe(5000000000)
  })

  test('UT-18: mengembalikan null jika nilai adalah 0', () => {
    expect(sanitizeBigInt(0)).toBeNull()
  })

  test('UT-19: mengembalikan null jika nilai string tidak mengandung angka', () => {
    expect(sanitizeBigInt('abc')).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. sanitizeFloat
// ─────────────────────────────────────────────────────────────────────────────
describe('sanitizeFloat()', () => {
  test('UT-20: mengembalikan null jika nilai null', () => {
    expect(sanitizeFloat(null)).toBeNull()
  })

  test('UT-21: mengembalikan null jika nilai undefined', () => {
    expect(sanitizeFloat(undefined)).toBeNull()
  })

  test('UT-22: mengembalikan null jika nilai string bukan angka', () => {
    expect(sanitizeFloat('abc')).toBeNull()
  })

  test('UT-23: mengembalikan float dari nilai string angka desimal', () => {
    expect(sanitizeFloat('3.14')).toBe(3.14)
  })

  test('UT-24: mengembalikan float dari nilai angka murni', () => {
    expect(sanitizeFloat(0.441)).toBeCloseTo(0.441)
  })

  test('UT-25: mengembalikan 0 jika nilai adalah 0', () => {
    expect(sanitizeFloat(0)).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. sanitizeStr
// ─────────────────────────────────────────────────────────────────────────────
describe('sanitizeStr()', () => {
  test('UT-26: mengembalikan null jika nilai null', () => {
    expect(sanitizeStr(null)).toBeNull()
  })

  test('UT-27: mengembalikan null jika nilai undefined', () => {
    expect(sanitizeStr(undefined)).toBeNull()
  })

  test('UT-28: mengembalikan null jika nilai string kosong', () => {
    expect(sanitizeStr('')).toBeNull()
  })

  test('UT-29: mengembalikan string apa adanya jika nilai valid', () => {
    expect(sanitizeStr('PT Indosat Tbk')).toBe('PT Indosat Tbk')
  })

  test('UT-30: mengembalikan string dengan spasi apa adanya', () => {
    expect(sanitizeStr('  spasi  ')).toBe('  spasi  ')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. calculateAutoFields
// ─────────────────────────────────────────────────────────────────────────────
describe('calculateAutoFields()', () => {
  // Total OPEX
  test('UT-31: menghitung Total OPEX dengan benar dari komponen biaya', () => {
    const result = calculateAutoFields({
      tcv: 5000000000,
      totalCoS: 1000000000,
      directOpex: 500000000,
      otherOpexDirect: 200000000,
      indirectOpex: 300000000,
      y1RevYearly: 0,
      totalCapex: 0
    })
    expect(result.totalOpex).toBe(2000000000)
  })

  test('UT-32: mengembalikan Total OPEX = 0 jika semua komponen biaya 0', () => {
    const result = calculateAutoFields({
      tcv: 0, totalCoS: 0, directOpex: 0,
      otherOpexDirect: 0, indirectOpex: 0,
      y1RevYearly: 0, totalCapex: 0
    })
    expect(result.totalOpex).toBe(0)
  })

  // EBITDA
  test('UT-33: menghitung EBITDA = TCV - Total OPEX dengan benar', () => {
    const result = calculateAutoFields({
      tcv: 5000000000,
      totalCoS: 1000000000,
      directOpex: 500000000,
      otherOpexDirect: 200000000,
      indirectOpex: 300000000,
      y1RevYearly: 0,
      totalCapex: 0
    })
    // totalOpex = 2.000.000.000, ebitda = 5.000.000.000 - 2.000.000.000
    expect(result.ebitda).toBe(3000000000)
  })

  test('UT-34: EBITDA bernilai negatif jika Total OPEX melebihi TCV', () => {
    const result = calculateAutoFields({
      tcv: 1000000000,
      totalCoS: 2000000000,
      directOpex: 0, otherOpexDirect: 0, indirectOpex: 0,
      y1RevYearly: 0, totalCapex: 0
    })
    expect(result.ebitda).toBe(-1000000000)
  })

  // EBITDA Margin
  test('UT-35: menghitung EBITDA Margin = EBITDA / TCV dengan benar', () => {
    const result = calculateAutoFields({
      tcv: 5000000000,
      totalCoS: 1000000000,
      directOpex: 500000000,
      otherOpexDirect: 200000000,
      indirectOpex: 300000000,
      y1RevYearly: 0,
      totalCapex: 0
    })
    // ebitda = 3.000.000.000, margin = 3/5 = 0.6
    expect(result.ebitdaMargin).toBeCloseTo(0.6)
  })

  test('UT-36: EBITDA Margin adalah null jika TCV = 0', () => {
    const result = calculateAutoFields({
      tcv: 0, totalCoS: 0, directOpex: 0,
      otherOpexDirect: 0, indirectOpex: 0,
      y1RevYearly: 0, totalCapex: 0
    })
    expect(result.ebitdaMargin).toBeNull()
  })

  // PPR Eligibility
  test('UT-37: PPR Eligibility = "Eligible" jika semua threshold terpenuhi', () => {
    const result = calculateAutoFields({
      tcv: 0,
      totalCoS: 2000000000,   // > 1 miliar
      directOpex: 0, otherOpexDirect: 0, indirectOpex: 0,
      y1RevYearly: 2000000000, // > 1 miliar
      totalCapex: 2000000000   // > 1 miliar
    })
    expect(result.pprEligibility).toBe('Eligible')
  })

  test('UT-38: PPR Eligibility = "Not Eligible" jika salah satu threshold tidak terpenuhi', () => {
    const result = calculateAutoFields({
      tcv: 0,
      totalCoS: 500000000,    // < 1 miliar
      directOpex: 0, otherOpexDirect: 0, indirectOpex: 0,
      y1RevYearly: 2000000000,
      totalCapex: 2000000000
    })
    expect(result.pprEligibility).toBe('Not Eligible')
  })

  test('UT-39: PPR Eligibility = "Not Eligible" jika semua nilai 0', () => {
    const result = calculateAutoFields({
      tcv: 0, totalCoS: 0, directOpex: 0,
      otherOpexDirect: 0, indirectOpex: 0,
      y1RevYearly: 0, totalCapex: 0
    })
    expect(result.pprEligibility).toBe('Not Eligible')
  })

  test('UT-40: menangani nilai undefined dengan menggantinya ke 0', () => {
    const result = calculateAutoFields({})
    expect(result.totalOpex).toBe(0)
    expect(result.ebitda).toBe(0)
    expect(result.ebitdaMargin).toBeNull()
    expect(result.pprEligibility).toBe('Not Eligible')
  })

  test('UT-55: EBITDA Margin dihitung dari TCV bernilai kecil', () => {
    const result = calculateAutoFields({
        tcv: 1,
        totalCoS: 0, directOpex: 0, otherOpexDirect: 0, indirectOpex: 0,
        y1RevYearly: 0, totalCapex: 0
    })
    // margin = (1-0)/1 = 1
    expect(result.ebitdaMargin).toBe(1)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 7. generateChangeSummary
// ─────────────────────────────────────────────────────────────────────────────
describe('generateChangeSummary()', () => {
  test('UT-41: mengembalikan null jika tidak ada perubahan', () => {
    const old = { bcTitle: 'Proyek A', projectStatus: 'On Progress' }
    const next = { bcTitle: 'Proyek A', projectStatus: 'On Progress' }
    expect(generateChangeSummary(old, next)).toBeNull()
  })

  test('UT-42: mendeteksi perubahan projectStatus', () => {
    const old = { projectStatus: 'On Progress' }
    const next = { projectStatus: 'Win' }
    const result = generateChangeSummary(old, next)
    expect(result).toContain('Status Proyek')
    expect(result).toContain('On Progress')
    expect(result).toContain('Win')
  })

  test('UT-43: mendeteksi perubahan bcTitle', () => {
    const old = { bcTitle: 'Judul Lama' }
    const next = { bcTitle: 'Judul Baru' }
    const result = generateChangeSummary(old, next)
    expect(result).toContain('Judul BC')
    expect(result).toContain('Judul Lama')
    expect(result).toContain('Judul Baru')
  })

  test('UT-44: mendeteksi perubahan nilai dari ada menjadi kosong', () => {
    const old = { followUpNotes: 'Catatan lama' }
    const next = { followUpNotes: '' }
    const result = generateChangeSummary(old, next)
    expect(result).toContain('Catatan Follow Up')
    expect(result).toContain('kosong')
  })

  test('UT-45: mendeteksi perubahan nilai dari kosong menjadi ada', () => {
    const old = { followUpNotes: null }
    const next = { followUpNotes: 'Catatan baru' }
    const result = generateChangeSummary(old, next)
    expect(result).toContain('Catatan Follow Up')
    expect(result).toContain('Catatan baru')
  })

  test('UT-46: mendeteksi beberapa perubahan sekaligus dan memisahkan dengan " | "', () => {
    const old = { bcTitle: 'Lama', projectStatus: 'On Progress' }
    const next = { bcTitle: 'Baru', projectStatus: 'Win' }
    const result = generateChangeSummary(old, next)
    expect(result).toContain(' | ')
  })

  test('UT-47: tidak mendeteksi perubahan jika nilai null dan string kosong (dianggap sama)', () => {
    const old = { cpbDate: null }
    const next = { cpbDate: '' }
    expect(generateChangeSummary(old, next)).toBeNull()
  })

  test('UT-48: mendeteksi perubahan fileName jika file diupload', () => {
    const old = { fileName: null }
    const next = { fileName: 'dokumen_bc.xlsx' }
    const result = generateChangeSummary(old, next)
    expect(result).toContain('File BC')
    expect(result).toContain('dokumen_bc.xlsx')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 8. summarizeServiceDetails
// ─────────────────────────────────────────────────────────────────────────────
describe('summarizeServiceDetails()', () => {
  test('UT-49: mengembalikan "kosong" jika array kosong', () => {
    expect(summarizeServiceDetails([])).toBe('kosong')
  })

  test('UT-50: mengembalikan "kosong" jika nilai null', () => {
    expect(summarizeServiceDetails(null)).toBe('kosong')
  })

  test('UT-51: mengembalikan "kosong" jika nilai undefined', () => {
    expect(summarizeServiceDetails(undefined)).toBe('kosong')
  })

  test('UT-52: menghasilkan ringkasan satu service detail dengan benar', () => {
    const details = [{ serviceId: 1, serviceSegment: 'TelCo', totalUnit: 5 }]
    const result = summarizeServiceDetails(details)
    expect(result).toContain('[1]')
    expect(result).toContain('Service ID: 1')
    expect(result).toContain('Segment: TelCo')
    expect(result).toContain('Unit: 5')
  })

  test('UT-53: menghasilkan ringkasan dua service detail dan dipisah " | "', () => {
    const details = [
      { serviceId: 1, serviceSegment: 'TelCo' },
      { serviceId: 2, serviceSegment: 'TechCo' }
    ]
    const result = summarizeServiceDetails(details)
    expect(result).toContain('[1]')
    expect(result).toContain('[2]')
    expect(result).toContain(' | ')
  })

  test('UT-54: mengabaikan field yang bernilai falsy dalam ringkasan', () => {
    const details = [{ serviceId: 1, serviceSegment: '', subServiceId: null }]
    const result = summarizeServiceDetails(details)
    expect(result).toContain('Service ID: 1')
    expect(result).not.toContain('Segment')
    expect(result).not.toContain('Sub-Service ID')
  })

  test('UT-56: memasukkan subServiceId dalam ringkasan jika ada', () => {
    const details = [{ serviceId: 1, subServiceId: 3 }]
    const result = summarizeServiceDetails(details)
    expect(result).toContain('Sub-Service ID: 3')
  })

    test('UT-57: memasukkan detailService dalam ringkasan jika ada', () => {
    const details = [{ serviceId: 1, detailService: 'Fiber Optik 100Mbps' }]
    const result = summarizeServiceDetails(details)
    expect(result).toContain('Detail: Fiber Optik 100Mbps')
  })

  test('UT-58: mengabaikan Service ID jika bernilai falsy', () => {
    const details = [{ serviceId: null, serviceSegment: 'TelCo' }]
    const result = summarizeServiceDetails(details)
    expect(result).not.toContain('Service ID')
    expect(result).toContain('Segment: TelCo')
  })
})