import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    enum: ['food', 'transport', 'rent', 'entertainment', 'shopping', 'healthcare', 'education', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/ // YYYY-MM format
  }
}, {
  timestamps: true
});

// Ensure unique budget per category per month
BudgetSchema.index({ categoryId: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);