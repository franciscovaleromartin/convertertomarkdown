export const MAX_FILE_SIZE = 20 * 1024 * 1024

const ACCEPTED_EXTS = [
  '.docx', '.pdf', '.xlsx', '.xls', '.html', '.htm',
  '.txt', '.md', '.csv', '.json', '.xml',
  '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif',
]
const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif']

export const ACCEPT_ATTR = [...ACCEPTED_EXTS, ...IMAGE_MIME].join(',')

export const FORMAT_CHIPS = [
  'DOCX', 'PDF', 'XLSX', 'XLS', 'HTML', 'TXT', 'MD',
  'CSV', 'JSON', 'XML', 'JPG', 'PNG', 'WEBP', 'BMP', 'GIF',
]
