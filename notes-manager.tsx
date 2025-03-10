import React, { useState, useEffect } from 'react';
import { PlusCircle, Image, Edit2, Save, X, Folder, BookOpen, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const NotesManager = () => {
  const [subjects, setSubjects] = useState(() => {
    const savedSubjects = localStorage.getItem('subjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 
      'History', 'Geography', 'Literature', 'Computer Science',
      'Economics', 'Psychology'
    ];
  });
  
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('subjectNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });
  
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [currentChapter, setCurrentChapter] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('subjectNotes', JSON.stringify(notes));
  }, [subjects, notes]);

  const toggleSubjectExpand = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const handleAddChapter = (subject) => {
    if (currentChapter.trim()) {
      setNotes(prev => ({
        ...prev,
        [subject]: {
          ...(prev[subject] || {}),
          [currentChapter]: {}
        }
      }));
      setCurrentChapter('');
    }
  };

  const handleAddTopic = (subject, chapter) => {
    if (currentTopic.trim()) {
      setNotes(prev => ({
        ...prev,
        [subject]: {
          ...(prev[subject] || {}),
          [chapter]: {
            ...(prev[subject]?.[chapter] || {}),
            [currentTopic]: []
          }
        }
      }));
      setCurrentTopic('');
    }
  };

  const handleImageUpload = (subject, chapter, topic, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          type: 'error',
          message: 'Image size should be less than 5MB'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setNotes(prev => ({
          ...prev,
          [subject]: {
            ...(prev[subject] || {}),
            [chapter]: {
              ...(prev[subject]?.[chapter] || {}),
              [topic]: [
                ...(prev[subject]?.[chapter]?.[topic] || []),
                {
                  url: e.target.result,
                  timestamp: new Date().toISOString(),
                  name: file.name
                }
              ]
            }
          }
        }));
        setAlert({
          type: 'success',
          message: 'Image uploaded successfully'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const deleteImage = (subject, chapter, topic, index) => {
    const updatedNotes = {...notes};
    updatedNotes[subject][chapter][topic].splice(index, 1);
    setNotes(updatedNotes);
  };

  const handleEditSubject = (index) => {
    setEditingSubject(index);
    setNewSubjectName(subjects[index]);
  };

  const handleSaveSubject = (index) => {
    if (newSubjectName.trim()) {
      const updatedSubjects = [...subjects];
      updatedSubjects[index] = newSubjectName.trim();
      setSubjects(updatedSubjects);
      setEditingSubject(null);
      setNewSubjectName('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-blue-800">Student Notes Manager</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, subjectIndex) => (
              <Card key={subjectIndex} className="bg-white/70 border-blue-100 shadow-md">
                <CardHeader 
                  className="bg-blue-50/50 border-b border-blue-100 cursor-pointer"
                  onClick={() => toggleSubjectExpand(subject)}
                >
                  <CardTitle className="flex items-center justify-between">
                    {editingSubject === subjectIndex ? (
                      <input
                        type="text"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="border border-blue-200 p-1 rounded w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="text-blue-900">{subject}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      {editingSubject === subjectIndex ? (
                        <button
                          onClick={() => handleSaveSubject(subjectIndex)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditSubject(subjectIndex)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {expandedSubjects[subject] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </CardTitle>
                </CardHeader>

                {expandedSubjects[subject] && (
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={currentChapter}
                          onChange={(e) => setCurrentChapter(e.target.value)}
                          placeholder="New Chapter"
                          className="flex-grow border border-blue-200 p-2 rounded"
                        />
                        <button
                          onClick={() => handleAddChapter(subject)}
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                          <Folder size={16} />
                        </button>
                      </div>

                      {notes[subject] && Object.keys(notes[subject]).map((chapter) => (
                        <div key={chapter} className="border-l-4 border-blue-300 pl-2">
                          <div className="font-semibold text-blue-800 mb-2">{chapter}</div>
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={currentTopic}
                              onChange={(e) => setCurrentTopic(e.target.value)}
                              placeholder="New Topic"
                              className="flex-grow border border-blue-200 p-2 rounded"
                            />
                            <button
                              onClick={() => handleAddTopic(subject, chapter)}
                              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                              <BookOpen size={16} />
                            </button>
                          </div>

                          {notes[subject][chapter] && Object.keys(notes[subject][chapter]).map((topic) => (
                            <div key={topic} className="mb-4">
                              <div className="text-blue-700 mb-2">{topic}</div>
                              <label className="block border-2 border-dashed border-blue-200 p-4 rounded-lg text-center cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(subject, chapter, topic, e)}
                                  className="hidden"
                                />
                                <div className="flex flex-col items-center">
                                  <PlusCircle className="w-8 h-8 text-blue-400" />
                                  <span className="mt-2 text-sm text-blue-500">Upload Note Image</span>
                                </div>
                              </label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {notes[subject][chapter][topic]?.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={image.url}
                                      alt={`Note ${index + 1}`}
                                      className="w-full h-24 object-cover rounded"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                      <button 
                                        onClick={() => handleImagePreview(image.url)}
                                        className="text-white hover:text-blue-400"
                                      >
                                        <Eye />
                                      </button>
                                      <button 
                                        onClick={() => deleteImage(subject, chapter, topic, index)}
                                        className="text-white hover:text-red-400"
                                      >
                                        <X />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Image Preview Modal */}
          <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
            <DialogContent className="max-w-4xl">
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full max-h-[80vh] object-contain" 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NotesManager;
