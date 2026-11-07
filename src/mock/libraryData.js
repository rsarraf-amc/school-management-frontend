export const categories = [
  { id: 1, name: "Science Fiction", code: "SF" },
  { id: 2, name: "Mathematics", code: "MTH" },
  { id: 3, name: "History", code: "HST" },
  { id: 4, name: "Literature", code: "LIT" },
  { id: 5, name: "Computer Science", code: "CS" }
];

export const books = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    bookNo: "BK-001",
    isbn: "978-0262033848",
    publisher: "MIT Press",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    rackNo: "A1",
    qty: 10,
    available: 7,
    price: 85.00
  },
  {
    id: 2,
    title: "A Brief History of Time",
    bookNo: "BK-002",
    isbn: "978-0553380163",
    publisher: "Bantam Books",
    author: "Stephen Hawking",
    category: "Science Fiction",
    rackNo: "B2",
    qty: 5,
    available: 2,
    price: 18.00
  },
  {
    id: 3,
    title: "Calculus: Early Transcendentals",
    bookNo: "BK-003",
    isbn: "978-1285741550",
    publisher: "Cengage",
    author: "James Stewart",
    category: "Mathematics",
    rackNo: "C1",
    qty: 15,
    available: 15,
    price: 120.00
  }
];

export const members = [
  {
    id: 1,
    memberId: "LIB-1001",
    libraryCardNo: "LC-1001",
    name: "Aarav Sharma",
    memberType: "Student",
    class: "10",
    section: "A",
    phone: "+91 9876543210"
  },
  {
    id: 2,
    memberId: "LIB-1002",
    libraryCardNo: "LC-1002",
    name: "Rajesh Kumar",
    memberType: "Staff",
    class: "N/A",
    section: "N/A",
    phone: "+91 9876543211"
  }
];

export const issueRecords = [
  {
    id: 1,
    memberId: "LIB-1001",
    name: "Aarav Sharma",
    bookTitle: "Introduction to Algorithms",
    bookNo: "BK-001",
    issueDate: "2024-04-15",
    dueDate: "2024-04-30",
    returnDate: "",
    status: "Issued"
  },
  {
    id: 2,
    memberId: "LIB-1002",
    name: "Rajesh Kumar",
    bookTitle: "A Brief History of Time",
    bookNo: "BK-002",
    issueDate: "2024-03-20",
    dueDate: "2024-04-05",
    returnDate: "",
    status: "Overdue"
  },
  {
    id: 3,
    memberId: "LIB-1001",
    name: "Aarav Sharma",
    bookTitle: "Calculus: Early Transcendentals",
    bookNo: "BK-003",
    issueDate: "2024-04-01",
    dueDate: "2024-04-15",
    returnDate: "2024-04-14",
    status: "Returned"
  }
];

export const libraryStats = {
  totalBooks: 4500,
  issuedBooks: 124,
  overdueBooks: 18,
  totalMembers: 850,
  categoryDistribution: [
    { name: "Science", value: 30 },
    { name: "Literature", value: 25 },
    { name: "History", value: 15 },
    { name: "Mathematics", value: 20 },
    { name: "Others", value: 10 }
  ],
  monthlyTrend: [
    { month: "Jan", issued: 150, returned: 140 },
    { month: "Feb", issued: 180, returned: 160 },
    { month: "Mar", issued: 200, returned: 190 },
    { month: "Apr", issued: 124, returned: 80 }
  ]
};
