import { useState } from 'react';
import Picker from 'emoji-picker-react';

const EmojiPicker = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (event, emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <div>
      <button theme="dark" onClick={() => setShowPicker((prevState) => !prevState)}>
        {showPicker ? '🙂' : '😀'}
      </button>
      {showPicker && <Picker onEmojiClick={handleEmojiClick} theme="dark" />}
    </div>
  );
};

export default EmojiPicker;