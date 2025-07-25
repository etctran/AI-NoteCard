import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import SmartTextEditor from "../components/SmartTextEditor";
import AIAssistantPanel from "../components/AIAssistantPanel";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleAIAssist = (message) => {
    setAiMessage(message);
    if (message.includes('Failed')) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleTextCorrection = (correctedText) => {
    setNote({ ...note, content: correctedText });
    toast.success('Text corrections applied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Editor Column */}
            <div className="xl:col-span-3">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-medium">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Note title"
                      className="input input-bordered input-lg w-full"
                      value={note.title}
                      onChange={(e) => setNote({ ...note, title: e.target.value })}
                    />
                  </div>

                  <div className="form-control mb-6">
                    <label className="label">
                      <span className="label-text font-medium">Content</span>
                    </label>
                    <SmartTextEditor
                      value={note.content}
                      onChange={(content) => setNote({ ...note, content })}
                      placeholder="Write your note here... Press Tab for AI completions"
                      className="textarea textarea-bordered min-h-96 resize-y text-base leading-relaxed w-full max-w-none"
                      onAIAssist={handleAIAssist}
                    />
                  </div>

                  <div className="card-actions justify-end pt-4">
                    <button
                      className="btn btn-primary btn-lg px-8"
                      disabled={saving}
                      onClick={handleSave}
                    >
                      {saving ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Column */}
            <div className="xl:col-span-1">
              <AIAssistantPanel 
                text={note.content}
                onTextCorrection={handleTextCorrection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
