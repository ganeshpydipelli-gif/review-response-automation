"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import StarRating from "./StarRating";

export default function EditModal({ isOpen, onClose, review, currentText, onSave }) {
  const [text, setText] = useState(currentText);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setText(currentText);
  }, [currentText, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Response" maxWidth="max-w-xl">
      {/* Review Context */}
      <div className="bg-surface-50 rounded-xl p-4 mb-4 border border-surface-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-surface-700">{review?.reviewerName}</span>
          <StarRating rating={review?.rating || 0} size="sm" />
        </div>
        <p className="text-xs text-surface-500 leading-relaxed">&ldquo;{review?.text}&rdquo;</p>
      </div>

      {/* Edit Area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-field min-h-[150px] resize-none"
          placeholder="Edit your response..."
        />
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${wordCount > 80 ? "text-negative-500" : "text-surface-400"}`}>
            {wordCount} / 80 words
          </span>
          <span className="text-xs text-surface-400">
            Edits improve AI learning
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={() => onSave(text)}
          disabled={!text.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}
