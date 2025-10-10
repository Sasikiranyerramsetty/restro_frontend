// Mock data for event management
const mockEvents = [
  {
    id: 1,
    title: 'Birthday Party - John Doe',
    type: 'Birthday',
    date: '2024-08-10',
    time: '19:00',
    guests: 10,
    status: 'confirmed',
    customer: 'John Doe',
    contact: 'john.doe@example.com',
    package: 'Premium',
    cost: 5000,
    specialRequests: 'Vegetarian options, no nuts'
  },
  {
    id: 2,
    title: 'Corporate Dinner - Tech Solutions',
    type: 'Corporate',
    date: '2024-09-05',
    time: '18:30',
    guests: 25,
    status: 'pending',
    customer: 'Jane Smith',
    contact: 'jane.smith@example.com',
    package: 'Standard',
    cost: 10000,
    specialRequests: 'Projector needed'
  },
  {
    id: 3,
    title: 'Anniversary Celebration - Mr. & Mrs. Brown',
    type: 'Anniversary',
    date: '2024-08-25',
    time: '20:00',
    guests: 4,
    status: 'confirmed',
    customer: 'David Brown',
    contact: 'david.brown@example.com',
    package: 'Romantic',
    cost: 3000,
    specialRequests: 'Window seat'
  }
];

const mockEventStats = {
  total: 4,
  confirmed: 2,
  pending: 1,
  completed: 1,
  totalRevenue: 110000,
  averageEventValue: 27500,
  byType: {
    'Birthday': 1,
    'Corporate': 1,
    'Anniversary': 1,
    'Wedding': 1
  },
  upcomingEvents: 3,
  thisMonthRevenue: 110000
};

let currentEvents = [...mockEvents];

class EventService {
  async getEvents() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: currentEvents };
  }

  async getEventById(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = currentEvents.find(evt => evt.id === id);
    return { success: true, data: event };
  }

  async getEventStats() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, total: currentEvents.length };
  }

  async addEvent(eventData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent = { ...eventData, id: Date.now() };
    currentEvents.push(newEvent);
    return { success: true, data: newEvent };
  }

  async updateEvent(id, updatedData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = currentEvents.findIndex(evt => evt.id === id);
    if (index !== -1) {
      currentEvents[index] = { ...currentEvents[index], ...updatedData };
      return { success: true, data: currentEvents[index] };
    }
    return { success: false, error: 'Event not found' };
  }

  async deleteEvent(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = currentEvents.length;
    currentEvents = currentEvents.filter(evt => evt.id !== id);
    if (currentEvents.length < initialLength) {
      return { success: true, message: 'Event deleted' };
    }
    return { success: false, error: 'Event not found' };
  }

  async updateEventStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const event = currentEvents.find(evt => evt.id === id);
    if (event) {
      event.status = status;
      return { success: true, data: event };
    }
    return { success: false, error: 'Event not found' };
  }
}

export default new EventService();
