import LocationData from './location_data'
import NoteData from './note_data'

export default function create(obj) {
  if (typeof obj === 'string') {
    obj = JSON.parse(obj)
  }
  switch (obj.type) {
    case 'location':
      return new LocationData(obj)
    case 'note':
      return new NoteData(obj)
  }
  throw new Error('Unknown secret type' + obj.type)
}
