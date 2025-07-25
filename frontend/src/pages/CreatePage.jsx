import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import SmartTextEditor from "../components/SmartTextEditor";
import AIAssistantPanel from "../components/AIAssistantPanel";


const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
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
    setContent(correctedText);
    toast.success('Text corrections applied!');
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Editor Column */}
            <div className="xl:col-span-3">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">Create New Note</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Title</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Note Title"
                        className="input input-bordered input-lg w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Content</span>
                      </label>
                      <SmartTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Write your note here... Press Tab for AI completions"
                        className="textarea textarea-bordered min-h-96 resize-y text-base leading-relaxed w-full max-w-none"
                        onAIAssist={handleAIAssist}
                      />
                    </div>

                    <div className="card-actions justify-end pt-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-8"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Creating...
                          </>
                        ) : (
                          "Create Note"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* AI Assistant Column */}
            <div className="xl:col-span-1">
              <AIAssistantPanel 
                text={content}
                onTextCorrection={handleTextCorrection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
