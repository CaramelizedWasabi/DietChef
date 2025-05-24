import React, { useState, useEffect } from 'react';
import './GoalPopup.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const GoalPopup = ({ onClose }) => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalData, setGoalData] = useState({ weight: null, dietGoal: '' });
  const [resultMsg, setResultMsg] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}/survey`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setGoalData({ weight: data.weight, dietGoal: data.dietGoal });
      }
    });
  }, []);

  const handleEvaluate = () => {
    const prev = parseFloat(goalData.weight);
    const curr = parseFloat(currentWeight);
    if (!prev || isNaN(curr) || curr <= 0) {
  setResultMsg("⚠️ Please enter a valid current weight (positive number).");
  return;
}

    const diff = curr - prev;
    const diffAbs = Math.abs(diff);

    if (goalData.dietGoal === 'maintain') {
      if (diffAbs <= 1.5) {
        setResultMsg('✅ You are maintaining your weight well!');
      } else {
        setResultMsg('⚠️ Your weight is outside the maintenance range. Please recheck your habits.');
      }
    } else {
      const percent = ((diffAbs / prev) * 100).toFixed(1);
      const verb = goalData.dietGoal === 'loss' ? 'lost' : 'gained';
      const success = (goalData.dietGoal === 'loss' && diff < 0) || (goalData.dietGoal === 'gain' && diff > 0);
      if (success) {
        setResultMsg(`🎉 You have ${verb} ${diffAbs}kg! That's about ${percent}% of your previous weight.`);
      } else {
        setResultMsg(`⚠️ Your weight change is opposite to your goal. Please re-evaluate your progress.`);
      }
    }
  };

  const renderQuestion = () => {
    return 'What is your current weight?';
  };

  return (
    <div className="goal-popup-overlay" onClick={onClose}>
      <div className="goal-popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>Goal Evaluation</h3>
        <div className="goal-row">
          <span>Previous Weight</span>
          <span>{goalData.weight ? `${goalData.weight}kg` : '-'}</span>
        </div>
        <div className="goal-row">
          <span>Your Goal</span>
          <span>{goalData.dietGoal || '-'}</span>
        </div>
        <div className="goal-row">
          <span>{renderQuestion()}</span>
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="kg"
          />
        </div>
        <button className="goal-button" onClick={handleEvaluate}>Check Result</button>
        {resultMsg && <div style={{ marginTop: '1rem', textAlign: 'center' }}>{resultMsg}</div>}
      </div>
    </div>
  );
};

export default GoalPopup;