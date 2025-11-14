// Mock data for event management
const today = new Date().toISOString().split('T')[0]; // Get today's date

const mockEvents = [
  {
    id: 1,
    title: 'Birthday Party - John Doe',
    type: 'Birthday',
    date: today, // Today's event
    time: '19:00',
    guests: 10,
    status: 'confirmed',
    customer: 'John Doe',
    contact: '+1 (555) 123-4567',
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
    contact: '+1 (555) 234-5678',
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
    contact: '+1 (555) 345-6789',
    package: 'Romantic',
    cost: 3000,
    specialRequests: 'Window seat'
  },
  {
    id: 4,
    title: 'Team Lunch - Marketing Department',
    type: 'Corporate',
    date: today, // Today's event
    time: '12:30',
    guests: 8,
    status: 'confirmed',
    customer: 'Sarah Wilson',
    contact: '+1 (555) 456-7890',
    package: 'Standard',
    cost: 2500,
    specialRequests: 'Quiet area preferred'
  },
  {
    id: 5,
    title: 'Family Dinner - Johnson Family',
    type: 'Family',
    date: today, // Today's event
    time: '18:00',
    guests: 6,
    status: 'pending',
    customer: 'Mike Johnson',
    contact: '+1 (555) 567-8901',
    package: 'Family',
    cost: 1800,
    specialRequests: 'High chair needed'
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

  async getTodaysEvents() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const todaysEvents = currentEvents.filter(event => event.date === today);
    return { success: true, data: todaysEvents };
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
