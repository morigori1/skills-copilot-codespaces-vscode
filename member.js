function skillsMember() {
    return {
        restrict: 'E',
        templateUrl: 'modules/members/views/partials/skills-member.html',
        scope: {
            member: '=',
            showSkills: '='
        },
        controller: function($scope, $element, $attrs) {
            $scope.skills = $scope.member.skills;
        }
    };
}