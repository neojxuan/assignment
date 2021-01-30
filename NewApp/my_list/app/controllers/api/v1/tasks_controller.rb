class Api::V1::TasksController < ApplicationController
  def index
    tasks = Task.all
    render json: tasks
  end

  def create
    @task = Task.create!(task_params)
    tag_list = params[:tags]
    tag_list.each do |tag_id|
      @tag = Tag.find(tag_id)
      @task.tags << @tag
    end
    if @task
      tags = @task.tags
      render :json => @task.to_json(:include => [:tags])
    else
      render json: @task.errors
    end
  end

  def show
    @task = Task.find(params[:id])
    if @task
      tags = @task.tags
      render :json => @task.to_json(:include => [:tags])
    else
      render json: @task.errors
    end
  end

  def edit
    task = Task.find(params[:id])
    if task
      render json: task
    else
      render json: task.errors
    end
  end

  def update
    @task = Task.find(params[:id])
    @task.tags.clear;
    tag_list = params[:tags]
    tag_list.each do |tag_id|
      @tag = Tag.find(tag_id)
      @task.tags << @tag
    end

    if @task.update(task_params)
      tags = @task.tags
      render :json => @task.to_json(:include => [:tags])
    else
      render :edit
    end
  end

  def destroy
    find_task&.destroy
    render json: {message: 'Task deleted'}
  end

  def search
    tag_list = params[:selected_tags]
    to_show = []
    tag_list.each do |tag_id|
      @tag = Tag.find(tag_id)
      @tasks = @tag.tasks
      # to_show << @tasks
      @tasks.each do |task|
        unless to_show.include?(task)
          to_show << task
        end
      end 
    end
    render json: to_show
  end

  private

  def task_params
    params.permit(:title, :details)
  end

  def find_task
    @task ||= Task.find(params[:id])
  end
end
