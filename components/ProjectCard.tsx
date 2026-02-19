import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, Code2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  variant?: 'classic' | 'glass';
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, variant = 'classic', className = '' }) => {
  const isGlass = variant === 'glass';

  return (
    <motion.div
      className={`relative group overflow-hidden rounded-xl cursor-pointer ${className} ${
        isGlass 
          ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg' 
          : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Background */}
      <div className="relative h-48 w-full overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isGlass ? 'from-black/80 via-black/20' : 'from-black/80 via-transparent'} to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-md ${
            isGlass ? 'bg-white/20 text-white' : 'bg-primary text-black'
          }`}>
            {project.type}
          </span>
        </div>
      </div>

      {/* Content Overlay - Always visible but moves up on hover */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <motion.div
            initial={{ y: 0 }}
            whileHover={{ y: -16 }} // Move up to make space for description
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-1 group-hover:text-white transition-colors">{project.subtitle}</p>
        </motion.div>

        {/* Hidden Details - Reveal on Hover */}
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileHover={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
        >
            <div className="pt-3 space-y-3">
                {project.description && (
                   <p className="text-xs text-gray-300 leading-relaxed border-t border-white/10 pt-2">
                       {project.description}
                   </p>
                )}
                
                {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech, i) => (
                            <span key={i} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300">
                                <Code2 size={10} /> {tech}
                            </span>
                        ))}
                    </div>
                )}
                
                {project.link && (
                    <div className="pt-2">
                        <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-white transition-colors">
                            View Project <ExternalLink size={12} />
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
