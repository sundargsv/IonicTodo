angular.module('todo.controllers', [])

    .controller('TodoCtrl', function ($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $ionicPopup) {

        // A utility function for creating a new project
        // with the given projectTitle
        var createProject = function (projectTitle) {
            var newProject = Projects.newProject(projectTitle);
            $scope.projects.push(newProject);
            Projects.save($scope.projects);
            $scope.selectProject(newProject, $scope.projects.length - 1);
        }


        // Load or initialize projects
        $scope.projects = Projects.all();

        // Grab the last active, or the first project
        $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

        // Called to create a new project
        $scope.newProject = function () {
            var projectTitle = prompt('Project name');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // Called to select the given project
        $scope.selectProject = function (project, index) {
            $scope.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        // Create NewTask modal
        $ionicModal.fromTemplateUrl('templates/new-task.html', function (modal) {
            $scope.taskModal = modal;

        }, {
                scope: $scope,
                animation: 'slide-in-up'
            });

        // Create EditTask modal
        $ionicModal.fromTemplateUrl('templates/edit-task.html', function (modal) {
            $scope.editTaskModal = modal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
            });

        // Edit and load the Modal for edit project
        $ionicModal.fromTemplateUrl('templates/edit-project.html', function (modal) {
            $scope.editProjectModal = modal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
            });

        $scope.createTask = function (taskInput) {
            //alert(taskInput.title);
            if (!$scope.activeProject || !taskInput) {
                return;
            }
            $scope.activeProject.tasks.push({
                title: taskInput.title,
                isDone: taskInput.title
            });
            $scope.taskModal.hide();

            // Inefficient, but save all the projects
            Projects.save($scope.projects);

            taskInput.title = "";
        };

        // $scope.removeTask = function(task) {
        //   //prompt(task);
        //   $scope.activeProject.tasks.remove({ task
        //   });

        //    Projects.save($scope.projects);

        // };

        $scope.newTask = function () {
            $scope.taskModal.show();

        };

        $scope.closeNewTask = function () {
            $scope.taskModal.hide();
        }

        $scope.closeEditTask = function () {
            $scope.editTaskModal.hide();
        }

        $scope.toggleProjects = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        //Editing the task
        $scope.editTask = function (i, task) {
            //alert(task.title);
            $scope.task = { title: task.title, isDone: task.isDone };
            $scope.taskIndex = i;
            $scope.editTaskModal.show();
        };

        // Called when the form is submitted
        $scope.updateTask = function (i, task) {
            if (!$scope.activeProject || !task) {
                return;
            }
            $scope.activeProject.tasks[i] = task;
            $scope.editTaskModal.hide();

            // Inefficient, but save all the projects
            Projects.save($scope.projects);
        };

        // Make sure to persist the change after is done is toggled
        $scope.doneClicked = function (i, task) {
            //alert("toggle done task "+task.isDone)
            if (!$scope.activeProject || !task) {
                return;
            }
            Projects.save($scope.projects);
        }

        // delete selected task
        $scope.deleteTask = function (i, task) {
            if (!$scope.activeProject || !task) {
                return;
            }
            console.log("start deleting");
            $scope.showConfirm('Delete Task', 'Are you sure you want to delete this task?', function () {
                console.log("confirmed to delete task " + i);
                $scope.activeProject.tasks.splice(i, 1);
                Projects.save($scope.projects);
            });
        }

        // A confirm dialog

        $scope.showConfirm = function (title, message, onYes, onNo) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: message
            });
            confirmPopup.then(function (res) {
                if (res) {
                    onYes();
                } else {
                    if (onNo)
                        onNo();
                }
            });
        };

        // open the edit project modal
        $scope.editProject = function (i, project) {
            $scope.project = { title: $scope.projects[i].title, tasks: $scope.projects[i].tasks };
            $scope.projectIndex = i;
            $scope.editProjectModal.show();
        };


        // Close the edit project modal
        $scope.closeEditProject = function () {
            $scope.editProjectModal.hide();
        };

        // Called when the form is submitted
        $scope.updateProject = function (i, project) {
            if (!$scope.projects || !project) {
                return;
            }
            $scope.projects[i] = project;
            $scope.editProjectModal.hide();

            // Inefficient, but save all the projects
            Projects.save($scope.projects);
            $scope.selectProject(project, i);
        };

        // delete selected project
        $scope.deleteProject = function (i, project) {
            if (!$scope.activeProject || !project) {
                return;
            }
            console.log("start deleting");
            $scope.showConfirm('Delete Project', 'Are you sure you want to delete this project?', function () {
                console.log("confirmed to delete project and all its tasks " + i);
                $scope.projects.splice(i, 1);
                Projects.save($scope.projects);
                //$window.location.reload(true)
                //$state.go('home', {}, {reload: true});
                //$state.go('home',{});
                //$state.reload();
                // $location.path('#/');
                // alert();
            });
        }
        // Try to create the first project, make sure to defer
        // this by using $timeout so everything is initialized
        // properly
        $timeout(function () {
            if ($scope.projects.length == 0) {
                while (true) {
                    var projectTitle = prompt('Your first project title:');
                    if (projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                }
            }
        }, 1000);

    })
